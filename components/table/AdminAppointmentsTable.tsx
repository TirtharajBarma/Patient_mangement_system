"use client";

import { useState, useMemo } from "react";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Appointment } from "@/types/appwrite.types";

interface AdminAppointmentsTableProps {
  appointments: Appointment[];
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminAppointmentsTable({ appointments }: AdminAppointmentsTableProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (filter !== "all") {
      filtered = appointments.filter((a) => a.status === filter);
    }

    // Sort by latest date
    return filtered.slice().sort((a, b) => {
      const dateA = new Date(a.schedule).getTime();
      const dateB = new Date(b.schedule).getTime();
      return dateB - dateA;
    });
    
  }, [appointments, filter]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-none">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[150px] flex justify-between items-center">
              {FILTERS.find((f) => f.value === filter)?.label || "All"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {FILTERS.map((f) => (
              <DropdownMenuItem key={f.value} onClick={() => setFilter(f.value)}>
                {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable data={filteredAppointments} columns={columns} />
    </div>
  );
}
