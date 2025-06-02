import { useState } from "react";
import { addDays, addMonths } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function DatePicker({ className, ...props }) {
  const today = new Date();
  const tommarrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const nextMonth = addMonths(today, 1);
  const [month, setMonth] = useState(today);
  const [date, setDate] = useState(today);

  return (
    <div className={cn("px-3 py-2 flex", className)}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          if (newDate) {
            setDate(newDate);
          }
        }}
        month={month}
        onMonthChange={setMonth}
        className="p-2"
        disabled={[
          { before: today }, // Dates before today
        ]}
        {...props}
      />
      <div className="flex flex-col px-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            setDate(today);
            setMonth(today);
          }}
        >
          Today
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            setDate(tommarrow);
            setMonth(tommarrow);
          }}
        >
          Tommarrow
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            setDate(nextWeek);
            setMonth(nextWeek);
          }}
        >
          Next week
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            setDate(nextMonth);
            setMonth(nextMonth);
          }}
        >
          Next month
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-8"
          onClick={() => {
            setDate(nextMonth);
            setMonth(nextMonth);
          }}
        >
          Close
        </Button>
        <Button
          size="sm"
          className="w-full mt-2"
          onClick={() => {
            setDate(nextMonth);
            setMonth(nextMonth);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
