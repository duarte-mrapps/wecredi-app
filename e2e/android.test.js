import { device, by, element } from 'detox';

describe('ScreenShots', () => {
  beforeAll(async () => {
    await device.launchApp({
      launchArgs: { isTesting: true },
      delete: true,
      newInstance: true,
      permissions: { notifications: 'YES', location: 'inuse' },
    });
  });

  afterAll(async () => {
    await device.uninstallApp()
  })

  it('should take screenshots of all screens', async () => {
    await new Promise(resolve => setTimeout(resolve, 15000));
    await device.takeScreenshot('01')

    await element(by.label('SearchTab')).tap()
    waitFor(element(by.label('SearchItem-0'))).toBeVisible()
    await new Promise(resolve => setTimeout(resolve, 5000));
    await device.takeScreenshot('02')

    await element(by.label('SearchItem-0')).tap()
    await new Promise(resolve => setTimeout(resolve, 5000));
    await device.takeScreenshot('03')

    await device.pressBack()

    await waitFor(element(by.label('AccountTab'))).toBeVisible().withTimeout(20000);
    await element(by.label('AccountTab')).tap()

    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.takeScreenshot('04')
  });
});
