class InGameTime{
   static insertSceneControlButton(ArrButtons){
   // if(ArrButtons){
    //ArrButtons.push({
        //name: "InGameTime",
        //title: "Clock",
        //layer:"Clock",
        //icon:"far fa-clock",
        //visible: true,
        //tools:[{
            //name: "Open",
            //title: "Open Game Clock",
            //icon:"far fa-clock",
            //visible: true,
            //onclick: () =>InGameTime.ShowClock(),
            //button: true 
        //}],
        //activeTool: "Open"
    //});
    //}
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
            InGameTime.Clock = new InGameTimeMasterClock();
        InGameTime.Clock.render(true);
   }
}

class InGameTimeClock extends Application{
    constructor(...args){
        super(...args)
        game.users.apps.push(this);
        this.Time = new Date();

    }
    
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = "Clock";
        options.id = "InGameTime";
        options.template = "modules/lmrtfy/templates/request-rolls.html";
        options.closeOnSubmit = false;
        options.popOut = true;
        options.width = 600;
        options.height = "auto";
        options.classes = ["InGameTime", "InGameTimeClock"];
        return options;
    }

    render(force, context={}){
        return super.render(force, context);
    }
}

class InGameTimeMasterClock extends FormApplication{
    constructor(...args){
        super(...args)
        game.users.apps.push(this);
        //this.Time = new Date();
        //this.DisplayTime(); 

        Hooks.on('renderApplication', (app, html, data)=>app===this?this.DisplayTime(html):null);
    }
    
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = "Clock";
        options.id = "InGameTime";
        options.template = "modules/InGameTime/templates/MasterClock.html";
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
            //var total = mins + this.Time.getMinutes();
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = mins + Time.getMinutes();
                Time.setMinutes(total % 60);
                game.settings.set("InGameTime", "Time", Time).then(()=>(this.DisplayTime()));
            }
        }
    }

    AddHours(Hours){
        if(Hours && Hours > 0){
            //var total = Hours + this.Time.getHours();
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = Hours + Time.getHours();
                Time.setHours(total % 24);
                game.settings.set("InGameTime", "Time", Time).then(()=>(this.DisplayTime()));
            }
        }
    }

    SubMinutes(mins){
        if(mins && mins > 0){
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = Time.getMinutes() - mins;
                while(total < 0){
                    total = total + 60;
                }
                Time.setMinutes(total);
                game.settings.set("InGameTime", "Time", Time).then(()=>(this.DisplayTime()));
            }
        }
    }

    SubHours(Hours){
        if(Hours && Hours > 0){
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = Time.getHours() - Hours;
                while(total < 0){
                    total = total + 24;
                }
                Time.setHours(total);
                game.settings.set("InGameTime", "Time", Time).then(()=>(this.DisplayTime()));
            }
        }
    }

    DisplayTime(render){
        var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                let display = "";
                let pm = false;
                if(Time.getHours() >= 12){
                    if(Time.getHours() == 12){
                        display = display.concat(Time.getHours());
                    }
                    else if(Time.getHours()-12 < 10){
                        display = display.concat("0",Time.getHours()-12);
                    }
                    else{
                        display = display.concat(Time.getHours()-12);
                    }
                    
                    pm = true;
                }
                else if(Time.getHours() == 0){
                    display = display.concat("12");
                }
                else{
                    if(Time.getHours() < 10){
                        display = display.concat("0",Time.getHours());
                    }
                    else{
                        display = display.concat(Time.getHours());
                    }
                    
                }
                if(Time.getMinutes() < 10){
                    display = display.concat(":0", Time.getMinutes());
                }
                else{
                    display = display.concat(":", Time.getMinutes());
                }
                if(pm){
                    display = display.concat(" ", "PM");
                }
                else{
                    display = display.concat(" ", "AM");
                }
                
                if(render){
                    render.find(".time").text(display);
                }
                else{
                    this.element.find(".time").text(display);   
                }
        }
    }

    async _updateObject(event, formData) {}
}

Hooks.on('getSceneControlButtons', InGameTime.insertSceneControlButton);
Hooks.once("init", () => {
    game.settings.register("InGameTime", "Time", {
        name: "Time",
        scope: "world",
        type: Date,
        default: Date.now(),
        onChange: value => {
            
        }
    });
});
//Hooks.on('renderApplication', (app, html, data) => typeof app === 'InGameTimeMasterClock'?app.DisplayTime:null);