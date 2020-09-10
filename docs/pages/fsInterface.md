The [fsInterface](https://sap.github.io/ui5-tooling/api/module-@ui5_fs.html#.fsInterface) module is a custom fs implementation which is used to replace node [fs](https://nodejs.org/api/fs.html).
A custom or modified fs can be necessary due to several reasons, maybe for caching functionality or to fallback to multiple locations automatically.

To ensure a module or library can be used with custom fs implementations, it is best practice
to be able to inject the desired fs module. For Example: `var tm = new TestModule({fs: someFs})` 

If a custom fs module is used, all required methods should be implemented.
Currently we only use the methods `readFile` and `stat` in *fsInterface*.
