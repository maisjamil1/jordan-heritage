import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { HomePage } from '@/pages/HomePage';
import { SitesPage } from '@/pages/SitesPage';
import { SiteDetailPage } from '@/pages/SiteDetailPage';
import { CulturePage } from '@/pages/CulturePage';
import { ArchivePage } from '@/pages/ArchivePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { EducationPage } from '@/pages/EducationPage';
import { VisitPage } from '@/pages/VisitPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { ReportDamagePage } from '@/pages/ReportDamagePage';
import { MapPage } from '@/pages/MapPage';

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="/sites/:id" element={<SiteDetailPage />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/report-damage" element={<ReportDamagePage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}
