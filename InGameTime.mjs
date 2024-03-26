import * as Utils from "./module/Utils.mjs";
class InGameTime{
   static insertSceneControlButton(ArrButtons){
   
    let Buttons = ArrButtons.find(b => b.name == "token")

    if(Buttons){
        Buttons.tools.push({
            name: "Open",
            title: "Open Game Clock",
            icon:"far fa-clock",
            visible: true,
            onClick: () => InGameTime.ShowClock(),
            button: true  
        })
    }

   } 

   static ShowClock(){
       if(InGameTime.Clock === undefined)
       if(game.user.isGM){
            InGameTime.Clock = new InGameTimeMasterClock();
       }
       else{
        InGameTime.Clock = new InGameTimeClock();
       }
        InGameTime.Clock.render(true);
   }
}

class InGameTimeMasterClock extends FormApplication{
    constructor(...args){
        super(...args)
        game.users.apps.push(this);
        Hooks.on('InGameTime.UpdatedTime', () => this.render(true));
    }

    get Time() {
        var time = game.settings.get("InGameTime", "Time");
        return this.DisplayTime(time);
      }

    get Light(){
        var time = game.settings.get("InGameTime", "Time");
        switch(time.getUTCHours()){
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 20:
            case 21:
            case 22:
            case 23:
                return "Darkness";
            case 5:
            case 6:
            case 18:
            case 19:
                return "Dim";
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
                return "Bright";
        }

    }

    getData(){
        return this;
    }
    
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = "Clock";
        options.id = "InGameTime";
        options.template = "modules/InGameTime/templates/MasterClock.hbs";
        options.closeOnSubmit = false;
        options.popOut = true;
        options.width = "auto";
        options.height = "auto";
        options.classes = ["InGameTime", "InGameTimeClock"];
        options.resizable = true;
        return options;
    }

    render(force, context={}){
        return super.render(force, context);
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.element.find(".Add-Long-Rest").click(() => this.AddHours(8));
        this.element.find(".Add-Hour-Ten").click(() => this.AddHours(10));
        this.element.find(".Add-Hour-five").click(() => this.AddHours(5));
        this.element.find(".Add-Hour").click(() => this.AddHours(1));
        this.element.find(".Add-Minute-Ten-Three").click(() => this.AddMinutes(30));
        this.element.find(".Add-Minute-Ten").click(() => this.AddMinutes(10));
        this.element.find(".Add-Minute-five").click(() => this.AddMinutes(5));
        this.element.find(".Add-Minute").click(() => this.AddMinutes(1));

        this.element.find(".Toggle-AM-PM").click(() => this.AddHours(12));
        this.element.find(".Sub-Hour-Ten").click(() => this.SubHours(10));
        this.element.find(".Sub-Hour-five").click(() => this.SubHours(5));
        this.element.find(".Sub-Hour").click(() => this.SubHours(1));
        this.element.find(".Sub-Minute-Ten-Three").click(() => this.SubMinutes(30));
        this.element.find(".Sub-Minute-Ten").click(() => this.SubMinutes(10));
        this.element.find(".Sub-Minute-five").click(() => this.SubMinutes(5));
        this.element.find(".Sub-Minute").click(() => this.SubMinutes(1));

    }

    AddMinutes(mins){
        if(mins && mins > 0 ){
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = mins + Time.getUTCMinutes();
                Time.setUTCMinutes(total % 60);
                game.settings.set("InGameTime", "Time", Time)
            }
        }
    }

    AddHours(Hours){
        if(Hours && Hours > 0){
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = Hours + Time.getUTCHours();
                Time.setUTCHours(total % 24);
                game.settings.set("InGameTime", "Time", Time)
            }
        }
    }

    SubMinutes(mins){
        if(mins && mins > 0){
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = Time.getUTCMinutes() - mins;
                while(total < 0){
                    total = total + 60;
                }
                Time.setUTCMinutes(total);
                game.settings.set("InGameTime", "Time", Time)
            }
        }
    }

    SubHours(Hours){
        if(Hours && Hours > 0){
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = Time.getUTCHours() - Hours;
                while(total < 0){
                    total = total + 24;
                }
                Time.setUTCHours(total);
                game.settings.set("InGameTime", "Time", Time);
            }
        }
    }

    DisplayTime(Time, render = false){
            if(typeof Time != "object"){
                Time = new Date(Time);
            }
            if(Time){
                let display = "";
                let pm = false;
                if(Time.getUTCHours() >= 12){
                    if(Time.getUTCHours() == 12){
                        display = display.concat(Time.getUTCHours());
                    }
                    else if(Time.getUTCHours()-12 < 10){
                        display = display.concat("0",Time.getUTCHours()-12);
                    }
                    else{
                        display = display.concat(Time.getUTCHours()-12);
                    }
                    
                    pm = true;
                }
                else if(Time.getUTCHours() == 0){
                    display = display.concat("12");
                }
                else{
                    if(Time.getUTCHours() < 10){
                        display = display.concat("0",Time.getUTCHours());
                    }
                    else{
                        display = display.concat(Time.getUTCHours());
                    }
                    
                }
                if(Time.getUTCMinutes() < 10){
                    display = display.concat(":0", Time.getUTCMinutes());
                }
                else{
                    display = display.concat(":", Time.getUTCMinutes());
                }
                if(pm){
                    display = display.concat(" ", "PM");
                }
                else{
                    display = display.concat(" ", "AM");
                }
                return display;
        }
    }

    async _updateObject(event, formData) {}
}

class InGameTimeClock extends InGameTimeMasterClock{
    
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = "Clock";
        options.id = "InGameTime";
        options.template = "modules/InGameTime/templates/Clock.hbs";
        options.closeOnSubmit = false;
        options.popOut = true;
        options.width = "auto";
        options.height = "auto";
        options.classes = ["InGameTime", "InGameTimeClock"];
        options.resizable = true;
        return options;
    }

}

Hooks.on('getSceneControlButtons', InGameTime.insertSceneControlButton);
Hooks.once("init", () => {
    game.settings.register("InGameTime", "Time", {
        name: "Time",
        scope: "world",
        type: Date,
        default: Date.now(),
        onChange: value => {
            Hooks.call("InGameTime.UpdatedTime");
        }
    });
    Utils.preloadHandlebars();
});