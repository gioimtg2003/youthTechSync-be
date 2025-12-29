export class CreateUserInviteEvent {
  constructor(
    public readonly teamName: string,
    public readonly url: string,
    public readonly email: string,
    public readonly time: Date,
  ) {}
}
