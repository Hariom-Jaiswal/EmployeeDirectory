from typing import Optional
from fastapi import HTTPException, status
from app.repository import EmployeeRepository
from app.schemas import PaginatedEmployeeResponse, EmployeeRead


class EmployeeService:
    """
    Business Logic Layer (Service) for Employee operations.
    Enforces business rules, sanitizes input, and handles edge cases.
    """

    def __init__(self, repository: EmployeeRepository):
        self.repository = repository

    async def search_employees(
        self,
        search: Optional[str] = None,
        mode: str = "both",
        limit: int = 20,
        offset: int = 0,
    ) -> PaginatedEmployeeResponse:
        """
        Validates, sanitizes, and executes employee search.
        
        Edge Cases:
        - Empty or Whitespace: Rejects with 400 Bad Request if passed empty string or spaces.
        - Length Overflow: Rejects strings > 100 characters with 400 Bad Request.
        """
        cleaned_search: Optional[str] = None

        if search is not None:
            stripped = search.strip()
            if len(stripped) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Search query cannot be empty or contain only whitespace.",
                )
            if len(stripped) > 100:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Search query cannot exceed 100 characters.",
                )
            cleaned_search = stripped

        employees, total = await self.repository.search_employees(
            search_term=cleaned_search,
            search_mode=mode,
            limit=limit,
            offset=offset,
        )

        return PaginatedEmployeeResponse(
            items=[EmployeeRead.model_validate(emp) for emp in employees],
            total=total,
            limit=limit,
            offset=offset,
        )
