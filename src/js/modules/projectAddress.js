export function projectId(url = new URL(location.href)) {
  const path = url.pathname.match(/^\/projetos\/([a-z0-9-]+)\/?$/);
  const id = path ? path[1] : url.searchParams.get('datahash');
  return id === 'p-4de80cf9-c38b-472d-85b7-6ce37877478c' ? 'arena-resende' : id;
}
export function projectPath(id) { return '/projetos/' + encodeURIComponent(id) + '/'; }
export function embeddedProject() {
  try {
    const data = JSON.parse(document.getElementById('project-data')?.textContent || 'null');
    return data?.datahash === projectId() ? data : null;
  } catch (_) { return null; }
}
