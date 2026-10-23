import UIKit
import GoogleMaps

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    GMSServices.provideAPIKey("AIzaSyC0khj6aM1ROrehyX_y6OB_JzcX-gYmhMM")
    return true
  }
}
