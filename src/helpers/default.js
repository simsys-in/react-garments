export function seo(data = {}) {
  var pageTitle = data.title.includes("Add ") ?  data.title.replace("Add ", "") : data.title.includes("Edit ") ?  data.title.replace("Edit ", "") : data.title.includes("List ") ?  data.title.replace("List ", "") : data.title;
  localStorage.setItem("title", pageTitle);
  data.title = data.title + ' | Garments ERP' || 'Garments ERP ';
  data.metaDescription = data.metaDescription + ' | Garments ERP' || 'Garments ERP ';

  document.title = data.title;
  document.querySelector('meta[name="description"]').setAttribute('content', data.metaDescription);
}