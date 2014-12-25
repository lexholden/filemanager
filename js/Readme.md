# Modules

Modules are pieces of backend code, and are stored in /app/js.

### Namespace

NO LONGER TRUE: Only CiceroApplication should be in the global namespace, all top level objects should be referenceable from here (CiceroApplication.CiceroSettings for example). These can then reference smaller submodules.

### Code style

Modules are wrapped in an anonymous function and contain a module.exports function. Look at /app/js/require-template.js for a reusable module template.

Imports are declared as such:
`var Obj1 Obj2 Obj3 simp1 simp2;`

Objects come first, them primitive NodeJs libraries and services. Likewise, require Objects, then primitives, then EventEmmitter and underscore.

# Components

Components are web components (frontend elements that deal with user input, pass messages to backend modules, and display responses). They are stored in subfolders per component within /app/components.

### Namespace

To differentiate Cicero components from 3rd party components (such as paper or polymer, which are by Google) they are all prefixed with cicero- (e.g. the entity-list component is stored in /app/components/cicero-entity-list/entity-list.html. 

If a component has multiple elements, these can then reference each other locally.

### Code Style


A project would need the following fields:

Title Author Date Created
