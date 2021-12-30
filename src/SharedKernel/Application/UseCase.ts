export interface UseCase<OutputData, InputData> {
  execute(inputData: InputData): OutputData;
}
