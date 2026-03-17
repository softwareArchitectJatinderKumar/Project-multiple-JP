"use client";


import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import JournalMenuBar from '@/component/TopMenubar/JournalMenuBar';
import JournalInnerMenu from '@/component/JournalInnerMenuComponent/JournalInnerMenuComponent';

import { IssueYearAccordion } from './IssueYearAccordion';

export default function JournalIssuesDetails() {
  const { Id: bookId, name: rawName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [groupedIssues, setGroupedIssues] = useState<any[]>([]);
  const [openYear, setOpenYear] = useState<string | null>(null);

  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
    return result;
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await myAppWebService.GetJournalIssues(bookId);
      const issues = response?.item1 || [];

      const grouped: Record<string, any[]> = {};
      issues.forEach((is: any) => {
        const year = new Date(is.publishDate).getFullYear().toString();
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(is);
      });

      const final = Object.entries(grouped).map(([year, list]) => ({
        year,
        data: chunkArray(list, 2)
      }));

      setGroupedIssues(final);
      if (final.length > 0) setOpenYear(final[0].year); // Open first year by default
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDownload = (file: string) => {
    window.open(`https://files.lpu.in/umsweb/Journal/${file}`, '_blank');
  };

  if (isLoading) return <div className="text-center p-5"><div className="spinner-border" /></div>;

  return (
    <>
      <JournalMenuBar />
      <JournalInnerMenu />
      <div className="container py-4">
        <h1 className="text-center mb-4">{String(rawName).replace(/-/g, ' ')}</h1>
        <div className="accordion accordion-flush" id="issuesAccordion">
          {groupedIssues.map((group) => (
            <IssueYearAccordion
              key={group.year}
              year={group.year}
              issues={group.data}
              isOpen={openYear === group.year}
              onToggle={() => setOpenYear(openYear === group.year ? null : group.year)}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </div>
    </>
  );
}