# UI5 FS

The [UI5 FS](https://github.com/SAP/ui5-fs) provides a UI5-specific file system abstraction

[**API Reference**](https://sap.github.io/ui5-tooling/v3/api/){: .md-button .sap-icon-initiative }

### Resources
During the build phase, a modified resource is kept in memory for further processing in other build steps.

This ensures performance, as physical read and write access for a high number of resources are kept to a minimum.

The virtual file system offers an abstraction layer from the physical file system. Amongst others, it can combine a bunch of scattered file locations into a well defined, virtualized structure.

### Adapters
Adapters abstract access to different resource locations.

The [memory adapter](lib/resources/adapters/Memory.js) represents a virtual file system, which maintains respective resources inside a data structure, whereas the [file system adapter](lib/resources/adapters/FileSystem.js) has direct access to the physical file system.

### Resource Readers
Maps virtual to physical paths.

### Collections
Multiple resource readers can be bundled to a collection. There are multiple types of collections which differ in their capability of having read or write access and in the order of how they obtain resources.

#### Collection
The collection has only read access.

The collection takes a list of readers. Readers are accessed in parallel: the reader which returns the resource first is used.

#### Prioritized Collection
The prioritized collection has only read access.

The collection takes a list of readers.
The readers are accessed prioritized in the same order as they are passed to the collection.

#### Duplex Collection
The duplex collection has read and write access.

The collection takes a single reader or collection of readers and a writer instance for writing results.
