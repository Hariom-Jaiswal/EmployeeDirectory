from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.models import Employee


class EmployeeRepository:
    """
    Data Access Layer
    All database queries     
    """

    def __init__(self, session: AsyncSession):
        self.session = session

    async def search_employees(
        self,
        search_term: Optional[str] = None,
        search_mode: str = "both",
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Employee], int]:
        """
        Executes an indexed prefix search query across `name`, `department`, or `both`.
        
        Optimizations:
        - B-Tree Friendly: Suffixes wildcard (`f"{term}%"`), enabling fast index range scans.
        - In-Engine Count: Performs `SELECT COUNT(id)` in database to save memory.
        - Wildcard Escaping: Escapes `%` and `_` to prevent accidental table-wide scans.
        """
        base_query = select(Employee)
        count_query = select(func.count(Employee.id))

        if search_term:
            escaped_term = (
                search_term.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_")
            )
            prefix_pattern = f"{escaped_term}%"

            if search_mode == "name":
                filter_condition = Employee.name.like(prefix_pattern)
            elif search_mode in ("dept", "department"):
                filter_condition = Employee.department.like(prefix_pattern)
            else:
                filter_condition = or_(
                    Employee.name.like(prefix_pattern),
                    Employee.department.like(prefix_pattern),
                )

            base_query = base_query.where(filter_condition)
            count_query = count_query.where(filter_condition)

        total_count = await self.session.scalar(count_query) or 0

        data_query = (
            base_query.order_by(Employee.id.asc())
            .offset(offset)
            .limit(limit)
        )
        result = await self.session.scalars(data_query)
        items = list(result.all())

        return items, total_count

    async def get_by_id(self, employee_id: str) -> Optional[Employee]:
        query = select(Employee).where(Employee.id == employee_id)
        return await self.session.scalar(query)

    async def get_by_email(self, email: str) -> Optional[Employee]:
        query = select(Employee).where(Employee.email == email)
        return await self.session.scalar(query)

    async def create(self, employee: Employee) -> Employee:
        self.session.add(employee)
        await self.session.commit()
        await self.session.refresh(employee)
        return employee
