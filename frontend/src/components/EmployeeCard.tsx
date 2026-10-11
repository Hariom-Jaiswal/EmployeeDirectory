import React, { useState } from 'react';
import type { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/*
 - M1, M2, M3 -> Male avatars
 - F4, F5, F6 -> Female avatars
*/

function getAvatarSource(id: string | number): string {
  const strId = String(id).trim().toUpperCase();

  const prefixMatch = strId.match(/^[MF]([1-6])/i);
  if (prefixMatch) {
    return `/avatars/avatar-${prefixMatch[1]}.jpg`;
  }

  //FallBack
  const isFemale = strId.startsWith('F');
  const numMatches = strId.match(/\d+/g);
  const numVal = numMatches ? parseInt(numMatches.join(''), 10) : 1;

  if (isFemale) {
    const femaleIndex = ((numVal - 1) % 3) + 4;
    return `/avatars/avatar-${femaleIndex}.jpg`;
  } else {
    const maleIndex = ((numVal - 1) % 3) + 1;
    return `/avatars/avatar-${maleIndex}.jpg`;
  }
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const avatarSrc = getAvatarSource(employee.id);
  const [imageFailed, setImageFailed] = useState(false);

  const roleDepartmentSlug = `${employee.department.toLowerCase()}/${employee.designation.toLowerCase()}`;

  return (
    <div
      className="group relative bg-[#ffffff] border border-neutral-300/80 hover:border-neutral-400 rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 flex flex-col justify-between h-full"
      id={`employee-card-${employee.id}`}
    >
      <div className="flex justify-center mb-1 shrink-0">
        <span className="font-mono text-[11px] tracking-widest text-neutral-600 font-bold select-none">
          ======
        </span>
      </div>
      <div className="grid grid-cols-[105px_1fr] sm:grid-cols-[115px_1fr] gap-3.5 items-center grow my-auto">
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
            {!imageFailed ? (
              <img
                src={avatarSrc}
                alt={employee.name}
                className="w-full h-full object-contain object-bottom select-none pointer-events-none group-hover:scale-103 transition-transform duration-200"
                onError={() => setImageFailed(true)}
              />
            ) : (
              //Fallback
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border border-neutral-300 flex items-center justify-center font-bold text-neutral-800 text-base bg-neutral-100">
                {getInitials(employee.name)}
              </div>
            )}
          </div>


          <div className="mt-1 text-center">
            <span className="font-mono text-xs font-medium text-neutral-700 tracking-wider">
              ID: {employee.id}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center min-w-0 space-y-1 py-1">
          <div className="text-xs font-mono text-neutral-600 font-medium leading-snug wrap-break-word">
            {roleDepartmentSlug}
          </div>
          <div className="pt-0.5">
            <h3 className="font-black text-xl sm:text-2xl text-neutral-900 tracking-tight leading-snug wrap-break-word">
              {employee.name}
            </h3>
            <div className="w-full border-b border-dashed border-neutral-400 my-1.5" />
          </div>


          <div className="text-xs text-neutral-700 break-all pt-0.5 leading-snug">
            <a
              href={`mailto:${employee.email}`}
              className="hover:text-black hover:underline transition-colors"
              title={employee.email}
            >
              {employee.email}
            </a>
          </div>

          <div className="font-mono text-xs font-medium text-neutral-800 pt-0.5">
            DOJ: {formatDate(employee.date_of_joining)}
          </div>
        </div>
      </div>
    </div>
  );
};
