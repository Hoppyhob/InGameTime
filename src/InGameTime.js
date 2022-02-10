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
        this.Time = new Date();
        this.DisplayTime(); 

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

    }

    AddMinutes(mins){
        if(mins && mins > 0){
            var total = mins + this.Time.getMinutes();
            this.Time.setMinutes(total % 60);
            this.DisplayTime();
        }
    }

    AddHours(Hours){
        if(Hours && Hours > 0){
            var total = Hours + this.Time.getHours();
            this.Time.setHours(total % 24);
            this.DisplayTime();
        }
    }

    DisplayTime(){
        let display = "";
        let pm = false;
        if(this.Time.getHours() >= 12){
            if(this.Time.getHours() == 12){
                display = display.concat(this.Time.getHours());
            }
            else if(this.Time.getHours()-12 < 10){
                display = display.concat("0",this.Time.getHours()-12);
            }
            else{
                display = display.concat(this.Time.getHours()-12);
            }
            
            pm = true;
        }
        else if(this.Time.getHours() == 0){
            display = display.concat("12");
        }
        else{
            if(this.Time.getHours() < 10){
                display = display.concat("0",this.Time.getHours());
            }
            else{
                display = display.concat(this.Time.getHours());
            }
            
        }
        if(this.Time.getMinutes() < 10){
            display = display.concat(":0", this.Time.getMinutes());
        }
        else{
            display = display.concat(":", this.Time.getMinutes());
        }
        if(pm){
            display = display.concat(" ", "PM");
        }
        else{
            display = display.concat(" ", "AM");
        }
        
        this.element.find(".time").text(display);
    }
}

Hooks.on('getSceneControlButtons', InGameTime.insertSceneControlButton);