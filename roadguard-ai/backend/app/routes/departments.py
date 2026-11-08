"""
RoadGuard AI — Departments & Jurisdictions Routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import Department
from ..schemas.schemas import DepartmentCreate, DepartmentResponse

router = APIRouter(prefix="/api/departments", tags=["Departments"])


@router.get("", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    """List all registered road maintenance authorities."""
    return db.query(Department).filter(Department.is_active == True).all()


@router.post("", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(dept_in: DepartmentCreate, db: Session = Depends(get_db)):
    """Register a new authority or municipal division."""
    existing = db.query(Department).filter(Department.name == dept_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department with this name already exists")

    dept = Department(
        name=dept_in.name,
        jurisdiction_reference=dept_in.jurisdiction_reference,
        contact_configuration=dept_in.contact_configuration,
        integration_status=dept_in.integration_status or "Demo Simulation Mode",
        sla_hours=dept_in.sla_hours or 72,
        escalation_rules=dept_in.escalation_rules,
        is_active=True,
    )
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(department_id: int, db: Session = Depends(get_db)):
    """Fetch department details by ID."""
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept
