import { ChangeDetectionStrategy, Component, input, } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Calculator, Entity, OtherOperator, Operator } from './calculator.type';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calculator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, NgbDropdownModule],
  styleUrl: './calculator.component.scss',
  template: `
    @let calculator = data(); @if (calculator) {
    <div class="calculator">
      <!-- ************************************ -->
      <!-- Calculator Header ****************** -->
      <!-- ************************************ -->
      <div class="input-group">
        <select class="form-select rounded-bottom-0">
          <option [value]="calculator.id">{{ calculator.name }}</option>
          <option [value]="3">3</option>
          <option [value]="2">2</option>
        </select>
        <button class="btn btn-outline-primary rounded-bottom-0" type="button">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
      </div>

      <div class="border border-top-0 p-2">
        <!-- ************************************ -->
        <!-- * Entity to operate ************** -->
        <!-- ************************************ -->
        <ul class="list-group list-group-flush  border-top-0 mx-2">
          @for (entity of calculator.entity; track entity.id) {
          <!-- Calculator Body -->
          <li
            class="list-group-item d-flex justify-content-between"
            (click)="handleClickEntity(entity.id)"
          >
            <div class="d-flex gap-3">
              <i [class]="['bi', 'bi-' + entity.icon]" [style.color]="entity.color"></i>
              <span [style.color]="entity.color">{{ entity.name }}</span>
            </div>
            <div>
              <span>{{ entity.resultCurrent }} / </span>
              <span [style.color]="entity.color">
                {{ entity.resultDefault }}</span
              >
            </div>
          </li>
          }
        </ul>

        @if( entitySelected ){
        <!-- ************************************ -->
        <!-- * Operation ************************ -->
        <!-- ************************************ -->
        <div
          class="col-auto form-control d-flex justify-content-end gap-2 mt-3"
          [style.border-color]="entitySelected.color"
        >
          <i> {{ entitySelected.resultCurrent }}</i>
          <span> {{ operatorSelected }}</span>
          <span> {{ numberToApply }}</span>
        </div>

        <!-- ************************************ -->
        <!-- * Keys ***************************** -->
        <!-- ************************************ -->
        <div class="text-center mt-2">
          <div class="row justify-content-between">
            <!-- Correctors -->
            <div class="btn-group col-md mb-2">
              <button
                type="button"
                class=" btn btn-primary"
                [style.background-color]="entitySelected.color"
                [style.border-color]="entitySelected.color"
                (click)="handleClickRareOperator(getOperator.RELOAD)"
              >
                <i [class]="['bi',  'bi-'+ getOperator.RELOAD]"></i>
              </button>
              <button
                type="button"
                class=" btn btn-primary"
                [style.background-color]="entitySelected.color"
                [style.border-color]="entitySelected.color"
                (click)="handleClickRareOperator(getOperator.BEFORE)"
              >
                <i [class]="['bi',  'bi-'+ getOperator.BEFORE]"></i>
              </button>
              <button
                type="button"
                class=" btn btn-primary"
                [style.background-color]="entitySelected.color"
                [style.border-color]="entitySelected.color"
                (click)="handleClickRareOperator(getOperator.DELETE)"
              >
                <!-- <i [class]="['bi',  'bi-'+ getOperator.DELETE]"></i> -->
                {{ getOperator.DELETE }}
              </button>
              <button
                type="button"
                class=" btn btn-primary"
                [style.background-color]="entitySelected.color"
                [style.border-color]="entitySelected.color"
                (click)="handleClickRareOperator(getOperator.CORRECT)"
              >
                <i [class]="['bi',  'bi-'+ getOperator.CORRECT]"></i>
              </button>
            </div>
            <!-- Operators -->
            <div class="btn-group col-md mb-2">
                @for(operator of operators; track $index){
                  <button
                    type="button"
                    class=" btn btn-primary"
                    [style.background-color]="entitySelected.color"
                    [style.border-color]="entitySelected.color"
                    (click)="handleClickOperator(operator)"
                  >
                  {{ operator }}
                </button>
              }
            </div>
          </div>
          <!-- Numbers -->
          <div class="calculator-key-group">
            @for(number of numbers; track $index){
              <button
                type="button"
                class=" btn btn-primary rounded-0"
                [style.background-color]="entitySelected.color"
                [style.border-color]="entitySelected.color"
                (click)="handleClickNumber(number.toString())"
              >
              {{ number }}
              </button>
            }
          </div>
          <!-- Equal -->
          <button
            type="button"
            class=" btn btn-primary mt-2 w-100"
            [style.background-color]="entitySelected.color"
            [style.border-color]="entitySelected.color"
            [disabled]="!this.operatorSelected || !this.numberToApply"
            (click)="handleClickRareOperator(getOperator.EQUAL)"
          >
          {{ getOperator.EQUAL }}
          </button>
          <!-- Customs keys -->
          @if(entitySelected.customOperations.length){
            <div class="custom-key-group mt-3">
              @for (customOperation of entitySelected.customOperations; track $index) {
              <button
                type="button"
                class=" btn btn-primary custom-key"
                [style.background-color]="customOperation.color"
                [style.border-color]="customOperation.color"
                (click)="handleClickCustomOperation(customOperation.operator, customOperation.numberToApply)"
              >
                {{ customOperation.operator }} {{ customOperation.numberToApply }}
              </button>
              }
            </div>
          }
        </div>
        }
      </div>
    </div>
    }
  `,
})
export class CalculatorComponent {

  // Calculator data 
  data = input.required<Calculator>();
  numbers: (number | string)[] = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, '00', '000'];
  operators: (Operator)[] = [Operator.ADDITION, Operator.SUBTRACTION, Operator.MULTIPLICATION, Operator.DIVISION];

  // Operation data
  entitySelected?: Entity;
  operatorSelected?: Operator;
  numberToApply?: string;
  numberBeforeOperate?: number;

  // Calculator Configuration
  numberOverflow: boolean = false;
  numberDecimals: boolean = false;
  clearOperationWhenOperate: boolean = true;
  clearOperationWhenSelectOperator: boolean = false;

  get getOperator() {
    return {
      ...Operator,
      ...OtherOperator,
    };
  }

  handleClickEntity(idEntity: number) {
    this.entitySelected = this.data().entity.find((elm) => elm.id === idEntity);
    if (this.entitySelected) {
      this.numberBeforeOperate = this.entitySelected.resultCurrent * 1;
      if (this.entitySelected.options) {
        this.numberOverflow = this.entitySelected.options.numberOverflow;
        this.numberDecimals = this.entitySelected.options.numberDecimals;
        this.clearOperationWhenOperate = this.entitySelected.options.clearOperationWhenOperate;
        this.clearOperationWhenSelectOperator = this.entitySelected.options.clearOperationWhenSelectOperator;
      }
    }
  }

  handleClickNumber(numberToApply: string) {
    if (this.numberToApply) this.numberToApply += numberToApply;
    else this.numberToApply = numberToApply;
  }

  handleClickOperator(operator: Operator) {
    if (this.clearOperationWhenSelectOperator) this.resetOperation();
    this.operatorSelected = operator;
  }

  handleClickRareOperator(operator: OtherOperator) {
    const operation = {
      [this.getOperator.CORRECT]: () => this.numberToApply = this.numberToApply?.slice(0, -1),
      [this.getOperator.DELETE]: () => this.numberToApply = '',
      [this.getOperator.EQUAL]: () => this.applyOperation(this.operatorSelected!, +this.numberToApply!),
      [this.getOperator.BEFORE]: () => this.entitySelected!.resultCurrent = this.numberBeforeOperate! * 1,
      [this.getOperator.RELOAD]: () => {
        if (this.entitySelected) {
          this.entitySelected.resultCurrent = this.entitySelected?.resultDefault;
          this.resetOperation();
        }
      }
    };
    operation[operator]();
  }

  handleClickCustomOperation(operator: Operator, numberToApply: number) {
    this.applyOperation(operator, numberToApply);
  }

  private applyOperation(operator: Operator, numberToApply: number) {
    const operation = {
      [Operator.ADDITION]: (num1: number, num2: number) => num1 + num2,
      [Operator.SUBTRACTION]: (num1: number, num2: number) => num1 - num2,
      [Operator.MULTIPLICATION]: (num1: number, num2: number) => num1 * num2,
      [Operator.DIVISION]: (num1: number, num2: number) => num1 / num2,
    };

    this.numberBeforeOperate = this.entitySelected!.resultCurrent * 1;
    let result = operation[operator](this.entitySelected!.resultCurrent, numberToApply);

    // Ensures the result does not use decimals
    if (!this.numberDecimals) {
      result = Math.round(result);
    }
    else {
      // If the result does decimals, round to 2 decimals
      result = Math.round((result + Number.EPSILON) * 100) / 100
    }

    // Ensures the result does not exceed the limits of the default result
    if (!this.numberOverflow) {
      if (result >= 0)
        result =
          result < this.entitySelected!.resultDefault
            ? result
            : this.entitySelected!.resultDefault;
      else 
        result = result > 0 ? result : 0;
    }

    this.entitySelected!.resultCurrent = result;

    // Reset operation
    if (this.clearOperationWhenOperate) {
      this.resetOperation();
    }
  }

  resetOperation() {
    this.numberToApply = undefined;
    this.operatorSelected = undefined;
  }
}
