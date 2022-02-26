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
       if(game.user.isGM){
            InGameTime.Clock = new InGameTimeMasterClock();
       }
       else{
        InGameTime.Clock = new InGameTimeClock();
       }
        InGameTime.Clock.render(true);
   }
}

class InGameTimeClock extends Application{
    constructor(...args){
        super(...args)
        game.users.apps.push(this);
        //this.Time = new Date();
        Hooks.on('renderApplication', (app, html, data)=>app===this?this.FirstRender(app, html, data):null);

    }

    FirstRender(app, html, data){
        var Time = game.settings.get("InGameTime", "Time");
        this.DisplayTime(Time, html);
        game.socket.on('module.InGameTime', (value)=>this.DisplayTime(value));
    }
    
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = "Clock";
        options.id = "InGameTime";
        options.template = "modules/InGameTime/templates/Clock.html";
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

    DisplayTime(Time, render){
        //var Time = game.settings.get("InGameTime", "Time");
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
                
                if(render){
                    render.find(".time").text(display);
                }
                else{
                    this.element.find(".time").text(display);   
                }
        }
    }
}

class InGameTimeMasterClock extends FormApplication{
    constructor(...args){
        super(...args)
        game.users.apps.push(this);
        //this.Time = new Date();
        //this.DisplayTime(); 
        //game.socket.on('module.lmrtfy', LMRTFY.onMessage);
        Hooks.on('renderApplication', (app, html, data)=>app===this?this.FirstRender(app, html, data):null);
    }

    FirstRender(app, html, data){
            var Time = game.settings.get("InGameTime", "Time");
            this.DisplayTime(Time, html);
            game.socket.on('module.InGameTime', (value)=>this.DisplayTime(value));
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
                var total = mins + Time.getUTCMinutes();
                Time.setUTCMinutes(total % 60);
                game.settings.set("InGameTime", "Time", Time)//.then(()=>(this.DisplayTime()));
            }
        }
    }

    AddHours(Hours){
        if(Hours && Hours > 0){
            //var total = Hours + this.Time.getHours();
            var Time = game.settings.get("InGameTime", "Time");
            if(Time){
                var total = Hours + Time.getUTCHours();
                Time.setUTCHours(total % 24);
                game.settings.set("InGameTime", "Time", Time)//.then(()=>(this.DisplayTime()));
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
                game.settings.set("InGameTime", "Time", Time)//.then(()=>(this.DisplayTime()));
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
                game.settings.set("InGameTime", "Time", Time);//.then(()=>(this.DisplayTime()));
            }
        }
    }

    DisplayTime(Time, render){
        //var Time = game.settings.get("InGameTime", "Time");
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
            game.socket.emit('module.InGameTime', value);
        }
    });
});
//Hooks.on('ready', (app, html, data) => typeof app === 'InGameTimeMasterClock'?app.DisplayTime:null);