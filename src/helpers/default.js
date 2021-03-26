export function seo(data = {}) {
    data.title = data.title + ' | Garments ERP' || 'Garments ERP ';
    data.metaDescription = data.metaDescription + ' | Garments ERP' || 'Garments ERP ';
  
    document.title = data.title;
    document.querySelector('meta[name="description"]').setAttribute('content', data.metaDescription);
  }