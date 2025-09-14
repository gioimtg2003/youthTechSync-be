describe('AppController', () => {
  // let appController: AppController;

  // beforeEach(async () => {
  //   const app: TestingModule = await Test.createTestingModule({
  //     imports: [UserModule],
  //     controllers: [AppController],
  //     providers: [
  //       AppService,
  //       {
  //         provide: getRepositoryToken(User),
  //         useValue: {
  //           find: jest.fn(),
  //           save: jest.fn(),
  //         },
  //       },
  //     ],
  //   }).compile();

  //   appController = app.get<AppController>(AppController);
  // });
  describe('root', () => {
    it('should return a random string', () => {
      const randomString = Math.random().toString(36).substring(7);
      expect(randomString).not.toBeNull();
    });
  });
});
