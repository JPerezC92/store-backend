export interface OutputPort<Argument, Return> {
  show(argument: Argument): Return;
}
