import { Component } from '@angular/core';
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

  /** Subscription for calculation results from the backend */
  private calcSubscription: Subscription;

  /** flag whether to show result screen or not */
  public showResult: boolean = false;
  private resultId: number = 0;

  /** check if value input changed */
  maschineValueChanged: boolean[] = [];
  maschineUserValueChanged: boolean[] = [];
  aiValueChanged: boolean[] = [];

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
      if (this.resultId < Number(data))
      {
        this.loadData();
        this.resultId = Number(data)
        this.showResult = true;
      }
    });
  }

  ngOnDestroy()
  {
    // unsubscribe
    this.calcSubscription.unsubscribe();
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
}
