import { Component } from '@angular/core';
import { TwoDigitsDirectiveDirective } from './two-digits-directive.directive';
import { AasWebsocketService } from './aas-websocket.service';
import { AssetAdministrationShellDescriptor, AssetAdministrationShellService, Submodel, ISubmodelElement } from 'src/swagger-typescript';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fabos-wbd-frontend';
  aasId: string = "";
  aasArray: Array<AssetAdministrationShellDescriptor> = [];
  submodels: Array<Submodel> = [];
  public wbdAiSubmodel: Submodel = {};
  public wbdMaschineSubmodel: Submodel = {};
  public wbdMaschineUserSubmodel: Submodel = {};
  public wbdAiSubmodelValues: Array<Object> = [];
  public wbdMaschineSubmodelValues: Array<Object> = [];
  public wbdMaschineUserSubmodelValues: Array<Object> = [];
  public exampleMachines: Array<Submodel> = [];
  public exampleServices: Array<Submodel> = [];

  /** Subscription for calculation results from the backend */
  private calcSubscription: Subscription;

  /** flag whether to show result screen or not */
  public showResult: boolean = false;
  public showChoice: boolean = true;
  private resultId: number = 0;

  /** check if value input changed */
  maschineValueChanged: boolean[] = [];
  maschineUserValueChanged: boolean[] = [];
  aiValueChanged: boolean[] = [];

  /** parameter for machine and service choice */
  machineOptions: string[] = [];
  serviceOptions: string[] = [];
  showMachineDropdown: boolean = false;
  showServiceDropdown: boolean = false;
  machineText: string = "Select a machine";
  serviceText: string = "Select a service";

  constructor(private aasService: AssetAdministrationShellService, private aasWebSocketService: AasWebsocketService) {
    // Start the WebSocket connection
    //this.aasWebSocketService.initializeWebSocket();
    this.aasWebSocketService.send('Frontend Startup');

    // Initialize calcSubscription
    this.calcSubscription = new Subscription();
  }

  ngOnInit()
  {
    // subscribe to calculation results
    this.calcSubscription = this.aasWebSocketService.calcItem$
    .subscribe((data: any) => 
    {
      console.log(data);
      if (data == "selected")
      {
        this.loadData()
        this.showChoice = false;
      }
      else if (this.resultId < Number(data))
      {
        this.loadData();
        this.resultId = Number(data)
        this.showResult = true;
      }
    });
  
  }

  ngAfterViewInit()
  {
    this.loadData()
  }

  ngOnDestroy()
  {
    // unsubscribe
    this.calcSubscription.unsubscribe();
  }

  loadExamples()
  {
    // load machine and service examples
    this.aasService.getSubmodelsFromShell(this.aasId).subscribe({
      next: (v) => {

        // get submodel values
        this.submodels = v
        for (let model of this.submodels)
        {
          if (model.idShort == "maschine1" || model.idShort == "maschine2" || model.idShort == "maschine3")
          {
            this.exampleMachines.push(model);
            for (let element of model.submodelElements!)
            {
              if (element.idShort == "Maschinenname")
                this.machineOptions.push(element.value!)
            }
            
          }
          else if (model.idShort == "service1" || model.idShort == "service2" || model.idShort == "service3")
          {
            this.exampleServices.push(model);
            for (let element of model.submodelElements!)
            {
              if (element.idShort == "Servicename")
                this.serviceOptions.push(element.value!)
            }
          }
        }
      },
      error: (e) => { console.error(e) },
      complete: () => { console.info('complete getAssetAdministrationShell') }
    });
  }

  loadSubmodels()
  {
    this.aasService.getSubmodelsFromShell(this.aasId).subscribe({
      next: (v) => {

        // get submodels
        //console.log(v); 
        this.submodels = v

        for (let model of this.submodels)
        {
          console.log(model.idShort)
          if (model.idShort == "WBDAISubmodel")
          {
            this.wbdAiSubmodel = model;
            this.loadSubmodelValues(this.wbdAiSubmodel.idShort!);
          }
          else if (model.idShort == "WBDMaschineSubmodel")
          {
            this.wbdMaschineSubmodel = model;
            this.loadSubmodelValues(this.wbdMaschineSubmodel.idShort!);
          }
          else if (model.idShort == "WBDMaschineUserSubmodel")
          {
            this.wbdMaschineUserSubmodel = model;
            this.loadSubmodelValues(this.wbdMaschineUserSubmodel.idShort!);
          }
        }
        console.log (this.wbdAiSubmodel)
        console.log (this.wbdMaschineSubmodel)
        console.log (this.wbdMaschineUserSubmodel)
      },
      error: (e) => { console.error(e) },
      complete: () => { console.info('complete getSubmodelsFromShell') }
    });
  }

  loadSubmodelValues(submodelId: string)
  {
    this.aasService.shellGetSubmodelValues(this.aasId, submodelId).subscribe({
      next: (v) => {

        // get submodel values
        if (submodelId == "WBDAISubmodel")
          {
            this.wbdAiSubmodelValues = v;
          }
          else if (submodelId == "WBDMaschineSubmodel")
          {
            this.wbdMaschineSubmodelValues = v;
          }
          else if (submodelId == "WBDMaschineUserSubmodel")
          {
            this.wbdMaschineUserSubmodelValues = v;
          }
          console.log(this.wbdAiSubmodelValues);
          console.log(this.wbdMaschineSubmodelValues);
          console.log(this.wbdMaschineUserSubmodelValues);
      },
      error: (e) => { console.error(e) },
      complete: () => { console.info('complete getAssetAdministrationShell') }
    });
  }

  onMInputChange(index: number) {
    this.maschineValueChanged[index] = true;
  }

  onMUInputChange(index: number) {
    this.maschineUserValueChanged[index] = true;
  }

  onAIInputChange(index: number) {
    this.aiValueChanged[index] = true;
  }

  loadData() {
    this.aasService.getAssetAdministrationShell().subscribe({
      next: (v) => {

        // get aas
        console.log(v); 
        this.aasArray = v
        this.aasId = this.aasArray[0].identification!.id
        this.loadSubmodels();
        if (this.machineOptions.length == 0)
          this.loadExamples();
      },
      error: (e) => { console.error(e) },
      complete: () => { console.info('complete getAssetAdministrationShell') }
    });
  }

  /** Save all changes to the AAS Server */
  saveChanges() {

    for (let i = 0; i <= this.maschineValueChanged.length; i++)
    {
      if (this.maschineValueChanged[i] == true)
      {
        this.aasService.shellPutSubmodelElementValueByIdShort(this.aasId, 
                                                              this.wbdMaschineSubmodel.idShort!, 
                                                              this.wbdMaschineSubmodel.submodelElements![i].idShort!, 
                                                              this.wbdMaschineSubmodel.submodelElements![i].value!).subscribe({
          next: (v) => {},
          error: (e) => { console.error(e) },
          complete: () => { console.info('complete shellPutSubmodelElementValueByIdShort') }
        });
      }
    }

    for (let i = 0; i <= this.maschineUserValueChanged.length; i++)
    {
      if (this.maschineUserValueChanged[i] == true)
      {
        this.aasService.shellPutSubmodelElementValueByIdShort(this.aasId, 
                                                              this.wbdMaschineUserSubmodel.idShort!, 
                                                              this.wbdMaschineUserSubmodel.submodelElements![i].idShort!, 
                                                              this.wbdMaschineUserSubmodel.submodelElements![i].value!).subscribe({
          next: (v) => {},
          error: (e) => { console.error(e) },
          complete: () => { console.info('complete shellPutSubmodelElementValueByIdShort') }
        });
      }
    }
    
    for (let i = 0; i <= this.aiValueChanged.length; i++)
    {
      if (this.aiValueChanged[i] == true)
      {
        this.aasService.shellPutSubmodelElementValueByIdShort(this.aasId, 
                                                              this.wbdAiSubmodel.idShort!, 
                                                              this.wbdAiSubmodel.submodelElements![i].idShort!, 
                                                              this.wbdAiSubmodel.submodelElements![i].value!).subscribe({
          next: (v) => {},
          error: (e) => { console.error(e) },
          complete: () => { console.info('complete shellPutSubmodelElementValueByIdShort') }
        });
      }
    }

    // reset all value change indicators
    this.maschineValueChanged = this.maschineValueChanged.map(_ => false);
    this.maschineUserValueChanged = this.maschineUserValueChanged.map(_ => false);
    this.aiValueChanged = this.aiValueChanged.map(_ => false);
  }

  calcResults() {
    // give wbd the order to calculate results
    //this.showResult = true;
    this.aasWebSocketService.send('calc');
  }

  calcDiff(value1: string, value2: string): number {
    return Number(value1) - Number(value2);

  }

  machineToggleDropdown() {
    this.showMachineDropdown = !this.showMachineDropdown;
  }

  selectMachineOption(option: string) {
    console.log('Selected option:', option);
    this.machineText = option;
    this.machineToggleDropdown();
  }

  serviceToggleDropdown() {
    this.showServiceDropdown = !this.showServiceDropdown;
  }

  selectServiceOption(option: string) {
    console.log('Selected option:', option);
    this.serviceText = option;
    this.serviceToggleDropdown();
  }

  nextData() {
    this.aasWebSocketService.send('combi;'+ this.machineText + ';' + this.serviceText);
    //this.loadData()
    
  }
}
