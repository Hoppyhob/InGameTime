export async function preloadHandlebars() {
    const partials = [
      // Clock
      "modules/InGameTime/templates/Clock.hbs",
      "modules/InGameTime/templates/MasterClock.hbs"
    ];
  
    const paths = {};
    for ( const path of partials ) {
      paths[path.replace(".hbs", ".html")] = path;
      paths[`InGameTime.${path.split("/").pop().replace(".hbs", "")}`] = path;
    }
  
    return loadTemplates(paths);
}