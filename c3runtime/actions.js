self.C3.Plugins.MyCompany_SingleGlobal.Acts = {
    Log(value) {
        this._SetLangProperty(value);
    },
    setSpriteFontText(group, value) {
        this._SetSpriteFontText(group, value);
    }
};