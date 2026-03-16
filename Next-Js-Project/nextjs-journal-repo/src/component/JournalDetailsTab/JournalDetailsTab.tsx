"use client";

import React, { useState } from 'react';
import styles from './JournalDetailsTab.module.css';

interface JournalDetailsTabProps {
  items: any;
}

export default function JournalDetailsTab({ items }: JournalDetailsTabProps) {
  const [activeTab, setActiveTab] = useState('Introduction');

  const itemsArray = items ? (Array.isArray(items) ? items : [items]) : [];

  const tabs = [
    { id: 'Introduction', label: 'Introduction', key: 'introduction' },
    { id: 'Scope-of-Journal', label: 'Scope of Journal', key: 'scopeofJournal' },
    { id: 'Thrust-Areas', label: 'Thrust Areas', key: 'thrustArea' },
    { id: 'Article-Types', label: 'Article Types', key: 'articleType' },
  ];

  if (itemsArray.length === 0) return null;

  return (
    <section className={styles.journalTabsSection}>
      <div className="container-fluid">
        <div className="row mb-5">
          <ul className="nav nav-tabs border-0 d-none d-lg-flex flex-column col-lg-3" role="tablist">
            {tabs.map((tab) => (
              <li key={tab.id} className="nav-item mb-2">
                <button
                  className={`nav-link w-100 text-start border-0 ${activeTab === tab.id ? 'active ' + styles.activeTab : styles.inactiveTab}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="col-lg-9 col-md-12">
            <div className="tab-content">
              {itemsArray.map((item, index) => (
                <div key={index}>
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`tab-pane fade ${activeTab === tab.id ? 'show active' : 'd-none d-lg-none'}`}
                      role="tabpanel"
                    >
                      <div 
                        className={`d-lg-none p-3 fw-bold border-bottom ${styles.accordionHeader}`}
                        onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                      >
                        {tab.label}
                      </div>

                      <div 
                        className={`${styles.accordionBody} ${styles.customScrollbar}`}
                        style={{ maxHeight: '340px', overflowY: 'auto' }}
                      >
                        <div 
                          className="p-3"
                          style={{ textAlign: 'justify' }}
                          dangerouslySetInnerHTML={{ __html: item[tab.key] || 'No information available.' }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}