from datetime import date
from sqlalchemy import String, Date
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Employee(Base):
    """
    Employee Database Model

    - name: (B tree index)
    - department: (B tree index)
    - email: (Unique B tree index)

    B tree to make prefix searching fast
    """
    
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True, index=True)
    department: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)
    date_of_joining: Mapped[date] = mapped_column(Date, nullable=False)

    def __repr__(self) -> str:
        return f"<Employee(id={self.id}, name='{self.name}', department='{self.department}')>"
