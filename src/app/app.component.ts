import { Component } from '@angular/core';
import { AasWebsocketService } from './aas-websocket.service';
import { AssetAdministrationShellDescriptor, AssetAdministrationShellService, Submodel, ISubmodelElement } from 'src/swagger-typescript';
import { FormsModule, NgForm } from '@angular/forms';

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

  constructor(private aasService: AssetAdministrationShellService) {
    // Start the WebSocket connection
    // this.aasWebSocketService.send('Hello Server!');
  }

  ngOnInit()
  {
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

  onSubmit(form: NgForm) {}
}
