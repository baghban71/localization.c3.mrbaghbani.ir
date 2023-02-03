const C3 = self.C3;

C3.Plugins.MRBaghbani_ir_Localization.Instance = class SingleGlobalInstance extends C3.SDKInstanceBase {
    constructor(inst, properties) {
        super(inst);


        this._lang = "fa";
        this._localizeData = null;
        this._objectMap = new Map();


        if (properties) // note properties may be null in some cases
        {

            this.ReadLocalizationData().then((data) => {
                this._localizeData = data;
                setTimeout(() => {
                    this.GetElements();
                    this.ReadSection();
                }, 1000);


            });

        }
    }

    Release() {
        super.Release();

    }
    async GetElements() {
        const runTime = await this.GetRuntime();
        this._localizeData.data.forEach((element) => {
            if (element.ui_id != undefined) {
                let _instance = runTime.GetInstanceByUID(element.ui_id);
                let sdk_instance = _instance.GetSdkInstance();
                let pluginType = _instance.GetPlugin().constructor.name;
                this._objectMap.set(element.ui_id, [_instance, sdk_instance, pluginType]);
            }
        });
        return;
    }

    async ReadLocalizationData() {
        const runTime = await this.GetRuntime();
        const assetManager = await runTime.GetAssetManager();
        const textFileUrl = await assetManager.GetProjectFileUrl("localization.json");
        const response = await fetch(textFileUrl);
        const fetchedText = await response.text();

        const obj = JSON.parse(fetchedText);
        return obj;
    }
    GetDataByLanguage() {
        let selectedElements = [];
        //select elements by languages
        this._localizeData.data.forEach((element) => {
            if (this._lang == element.lang)
                selectedElements.push(element);
        });

        return selectedElements;
    }
    _GetVariable(name) {
        let _var = "";
        this._localizeData.data.forEach((element) => {
            if (element.var == name && element.lang == this._lang)
                _var = element.message;
        });
        //console.log(_var);
        return _var;
    }
    _SetSpriteFontText(group, value) {
        this._localizeData.data.forEach((element) => {
            if (element.group == group) {
                if (element.lang == this._lang)
                    this._objectMap.get(element.ui_id)[1]._SetText(value);
                else
                    this._objectMap.get(element.ui_id)[1]._SetText("");

            }
        });
    }
    ReadSection() {

        this._localizeData.data.forEach((element) => {

            if (element.ui_id != undefined && element.group != undefined) {
                let _instance = this._objectMap.get(element.ui_id);
                if (_instance != undefined) {
                    if (element.lang != this._lang) {
                        let spriteFontText = _instance[1];
                        spriteFontText._SetText("");
                    } else {
                        let spriteFontText = _instance[1];
                        spriteFontText._SetText(element.message);
                    }
                }
            }

            // if type is variable
            if (element.ui_id == undefined || element.lang != this._lang)
                return;

            let textObject = null; // = [];
            let spriteObject = null; // = [];

            let instance = this._objectMap.get(element.ui_id);
            switch (instance[2]) {
                case "TextPlugin":
                    textObject = instance[1];
                    textObject._SetText(element.message);
                    if (element.size != undefined)
                        textObject._SetFontSize(element.size);
                    if (element.font != undefined)
                        textObject._SetFontFace(element.font);
                    if (element.h_aligment != undefined)
                        textObject._SetHAlign(element.h_aligment);

                    break;
                case "SpritePlugin":
                    spriteObject = instance[1];
                    spriteObject._SetAnimFrame(element.frame);


                    break;
            }


        });
    }


    _SetLangProperty(n) {
        this._lang = n;
        this.ReadSection();
    }

    _GetLangProperty() {
        return this._lang;
    }

    SaveToJson() {
        return {
            // data to be saved for savegames
        };
    }

    LoadFromJson(o) {
        // load state for savegames
    }

    GetScriptInterfaceClass() {
        return self.IMySingleGlobalInstance;
    }

};

// Script interface. Use a WeakMap to safely hide the internal implementation details from the
// caller using the script interface.
const map = new WeakMap();

self.IMySingleGlobalInstance = class IMySingleGlobalInstance extends self.IInstance {
    constructor() {
        super();

        // Map by SDK instance
        map.set(this, self.IInstance._GetInitInst().GetSdkInstance());
    }

    // Example setter/getter property on script interface
    set langProperty(n) {
        map.get(this)._SetLangProperty(n);
    }

    get langProperty() {
        return map.get(this)._GetLangProperty();
    }

    get variable() {
        return map.get(this)._GetVariable('h');
    }

};