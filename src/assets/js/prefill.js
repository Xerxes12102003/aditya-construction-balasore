const map = {
  "architectural-planning": "home-plan",
  "structural-drawings": "home-plan",
  "civil-engineering": "commercial",
  "interior-design": "interiors",
  landscape: "other",
  vastu: "vastu",
  "3d-visualisation": "home-plan",
};

const slug = new URLSearchParams(window.location.search).get("service");
const select = document.querySelector("#service");
if (slug && select && map[slug]) select.value = map[slug];
