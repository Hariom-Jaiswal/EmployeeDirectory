from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db, check_db_connection
from app.repository import EmployeeRepository
from app.service import EmployeeService
from app.schemas import PaginatedEmployeeResponse

router = APIRouter(tags=["Employees"])


def get_employee_service(
    session: AsyncSession = Depends(get_db),
) -> EmployeeService:
    """Dependency injection: session -> repository -> service"""
    repository = EmployeeRepository(session)
    return EmployeeService(repository)


@router.get(
    "/employees",
    response_model=PaginatedEmployeeResponse,
    summary="Search employees by name or department prefix",
    description="prefix search on name and department columns.",
)
async def search_employees(
    search: Optional[str] = Query(
        default=None,
        description="Prefix search string to match employee name or department",
    ),
    mode: str = Query(
        default="both",
        description="Search mode: 'both', 'name', or 'department'",
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
        description="Maximum employee records per page (1-100)",
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Number of employee records to skip",
    ),
    service: EmployeeService = Depends(get_employee_service),
) -> PaginatedEmployeeResponse:
    """Delegates query execution strictly to the Service layer"""
    return await service.search_employees(search=search, mode=mode, limit=limit, offset=offset)


@router.get("/health", tags=["System"], summary="Application & Database Health Status")
async def health_check(response: Response):
    """Verifies that the application and database connectivity are healthy"""
    db_alive = await check_db_connection()
    if not db_alive:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "degraded",
            "database": "unreachable",
            "message": "Database connection failed. Please check database service.",
        }

    return {
        "status": "healthy",
        "database": "connected",
        "message": "Service is operating normally.",
    }
