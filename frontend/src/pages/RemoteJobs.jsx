import React from 'react';
import Jobs from './Jobs';
import { useLang } from '../context/LanguageContext';

export default function RemoteJobs() {
  const { t } = useLang();
  return <Jobs forcedRemote={true} title={t("jobs.remote_jobs_title")} subtitle={t("jobs.remote_jobs_sub")} />;
}
