from datetime import date
from typing import List
from pydantic import BaseModel, Field, ConfigDict

try:
    import email_validator  # noqa
    from pydantic import EmailStr
except ImportError:
    EmailStr = str


class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full name of employee")
    email: EmailStr = Field(..., description="Unique company email address")
    department: str = Field(..., min_length=1, max_length=50, description="Department name")
    designation: str = Field(..., min_length=1, max_length=100, description="Job title / designation")
    date_of_joining: date = Field(..., description="Date of joining (YYYY-MM-DD)")



class EmployeeRead(EmployeeBase):
    """Schema for returning employee data to clients"""
    id: str = Field(..., description="Unique employee identifier")

    model_config = ConfigDict(from_attributes=True)


class PaginatedEmployeeResponse(BaseModel):
    """Standard paginated response envelope"""
    items: List[EmployeeRead] = Field(..., description="List of matching employee records")
    total: int = Field(..., description="Total count of matching records across all pages")
    limit: int = Field(..., description="Maximum items per page requested")
    offset: int = Field(..., description="Offset / items skipped")
