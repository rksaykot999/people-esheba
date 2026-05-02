import React from 'react';
import Jobs from './Jobs';
import { useLang } from '../context/LanguageContext';

export default function FullTimeJobs() {
  const { t } = useLang();
  return <Jobs forcedType="full-time" title={t("jobs.fulltime_jobs_title")} subtitle={t("jobs.fulltime_jobs_sub")} />;
}
