const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.MRBaghbani_ir_Localization;

PLUGIN_CLASS.Instance = class MyCustomInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }

    Release() {}

    OnCreate() {}

    OnPropertyChanged(id, value) {
        console.log("---[[ OnPropertyChanged", id, value);
    }

    LoadC2Property(name, valueString) {
        return false; // not handled
    }
};