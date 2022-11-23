import {Component, h, Prop, Event, EventEmitter, Method} from "@stencil/core";
import {StorageDriverDescriptor, Variable} from "../../../models";
import {FormEntry} from "../../shared/forms/form-entry";
import {isNullOrWhitespace} from "../../../utils";
import descriptorsStore from '../../../data/descriptors-store';

@Component({
  tag: 'elsa-variable-editor-dialog-content',
  shadow: false
})
export class VariableEditorDialogContent {
  private formElement: HTMLFormElement;

  @Prop() variable: Variable;
  @Event() variableChanged: EventEmitter<Variable>;

  @Method()
  async getVariable(): Promise<Variable> {
    return this.getVariableInternal(this.formElement);
  }

  render() {
    const variable: Variable = this.variable ?? {name: '', typeName: 'Object'};
    const variableTypeName = variable.typeName;
    const availableTypeNames: Array<string> = ['Object', 'String', 'Boolean', 'Int32', 'Int64', 'Single', 'Double']; // TODO: Fetch these from backend.
    const storageDrivers: Array<StorageDriverDescriptor> = [{id: null, displayName: '-'}, ...descriptorsStore.storageDrivers];

    return (
      <div>
        <form ref={el => this.formElement = el} class="h-full flex flex-col bg-white" onSubmit={e => this.onSubmit(e)} method="post">
          <div class="pt-4">
            <h2 class="text-lg font-medium ml-4 mb-2">Edit Variable</h2>
            <div class="align-middle inline-block min-w-full border-b border-gray-200">

              <FormEntry fieldId="variableName" label="Name" hint="The technical name of the variable.">
                <input type="text" name="variableName" id="variableName" value={variable.name}/>
              </FormEntry>

              <FormEntry fieldId="variableTypeName" label="Type" hint="The type of the variable.">
                <select id="variableTypeName" name="variableTypeName">
                  {availableTypeNames.map(typeName => <option value={typeName} selected={typeName == variableTypeName}>{typeName}</option>)}
                </select>
              </FormEntry>

              <FormEntry fieldId="variableValue" label="Value" hint="The value of the variable.">
                <input type="text" name="variableValue" id="variableValue" value={variable.value}/>
              </FormEntry>

              <FormEntry fieldId="variableStorageDriverId" label="Storage" hint="The storage to use when persisting the variable.">
                <select id="variableStorageDriverId" name="variableStorageDriverId">
                  {storageDrivers.map(driver => {
                    const value = driver.id;
                    const text = driver.displayName;
                    const selected = value == variable.storageDriverId;
                    return <option value={value} selected={selected}>{text}</option>;
                  })}
                </select>
              </FormEntry>

            </div>
          </div>
        </form>
      </div>
    );
  }

  private onSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const variable = this.getVariableInternal(form);
    this.variableChanged.emit(variable);
  };

  private getVariableInternal = (form: HTMLFormElement): Variable => {
    const formData = new FormData(form as HTMLFormElement);
    const name = formData.get('variableName') as string;
    const value = formData.get('variableValue') as string;
    const type = formData.get('variableTypeName') as string;
    const driverId = formData.get('variableStorageDriverId') as string;
    const variable = this.variable;

    variable.name = name;
    variable.typeName = type;
    variable.value = value;
    variable.storageDriverId = isNullOrWhitespace(driverId) ? null : driverId;

    return variable;
  };

}
