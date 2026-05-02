import React from 'react';
import Jobs from './Jobs';
import { useLang } from '../context/LanguageContext';

export default function GovtJobs() {
  const { t } = useLang();
  return <Jobs forcedType="govt" title={t("jobs.govt_jobs_title")} subtitle={t("jobs.govt_jobs_sub")} />;
}
