import ExpoModulesCore
import UIKit

public class RnIosSystemTokensModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RnIosSystemTokens")

    Events("onFontsChanged", "onColorsChanged")

    Function("getSystemFonts") { () -> [String: Any] in
      return self.getAllFontMetrics()
    }

    Function("getSystemColors") { () -> [String: String] in
      return self.getAllSystemColors()
    }

    OnStartObserving {
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.handleDynamicTypeChange),
        name: UIContentSizeCategory.didChangeNotification,
        object: nil
      )
    }

    OnStopObserving {
      NotificationCenter.default.removeObserver(self)
    }
  }

  @objc func handleDynamicTypeChange() {
    sendEvent("onFontsChanged", getAllFontMetrics())
  }

  // We need to listen to trait changes in the view controller,
  // currently we can rely on system redraws, but explicitly observing implies
  // integrating with a wrapper view or using KVO on traitCollection if possible.
  // For simplicity in this module scope, we expect the JS to re-query or
  // we can use a simpler approach: listening to 'traitCollectionDidChange' isn't direct in Module.
  // However, `UIUserInterfaceStyle` changes usually trigger layout updates.
  // A robust way in a pure module is hard without a View.
  // We will assume re-fetching on Appearance change from JS side or
  // add a hook in AppDelegate if strictly needed.
  // BUT, we can check for `traitCollectionDidChange` notifications if available (not standard).
  // Standard way: JS listens to Appearance.addChangeListener -> calls getSystemColors again.
  // *Native way*: We'll stick to basic implementation unless user asks for robust View-based observer.

  private func getAllFontMetrics() -> [String: Any] {
    let styles: [String: UIFont.TextStyle] = [
      "largeTitle": .largeTitle,
      "title1": .title1,
      "title2": .title2,
      "title3": .title3,
      "headline": .headline,
      "body": .body,
      "callout": .callout,
      "subheadline": .subheadline,
      "footnote": .footnote,
      "caption1": .caption1,
      "caption2": .caption2
    ]

    var metrics: [String: Any] = [:]

    for (key, style) in styles {
      let font = UIFont.preferredFont(forTextStyle: style)
      metrics[key] = [
        "fontSize": font.pointSize,
        "fontWeight": self.getFontWeightString(font: font),
        "lineHeight": font.lineHeight,
        "letterSpacing": 0, // UIFont doesn't expose easy letterSpacing for system fonts directly without attributes
        "textStyle": key
      ]
    }
    return metrics
  }

  private func getAllSystemColors() -> [String: String] {
      // Resolve colors against current trait collection
      let traitCollection = UITraitCollection.current

      let colors: [String: UIColor] = [
          // Text
          "label": .label,
          "secondaryLabel": .secondaryLabel,
          "tertiaryLabel": .tertiaryLabel,
          "quaternaryLabel": .quaternaryLabel,
          "placeholderText": .placeholderText,
          "link": .link,

          // Backgrounds
          "systemBackground": .systemBackground,
          "secondarySystemBackground": .secondarySystemBackground,
          "tertiarySystemBackground": .tertiarySystemBackground,
          "systemGroupedBackground": .systemGroupedBackground,
          "secondarySystemGroupedBackground": .secondarySystemGroupedBackground,
          "tertiarySystemGroupedBackground": .tertiarySystemGroupedBackground,

          // Fill
          "systemFill": .systemFill,
          "secondarySystemFill": .secondarySystemFill,
          "tertiarySystemFill": .tertiarySystemFill,
          "quaternarySystemFill": .quaternarySystemFill,

          // Standard Colors
          "systemBlue": .systemBlue,
          "systemGreen": .systemGreen,
          "systemIndigo": .systemIndigo,
          "systemOrange": .systemOrange,
          "systemPink": .systemPink,
          "systemPurple": .systemPurple,
          "systemRed": .systemRed,
          "systemTeal": .systemTeal,
          "systemYellow": .systemYellow,
          "systemGray": .systemGray,
          "systemGray2": .systemGray2,
          "systemGray3": .systemGray3,
          "systemGray4": .systemGray4,
          "systemGray5": .systemGray5,
          "systemGray6": .systemGray6,
      ]

      var hexColors: [String: String] = [:]
      for (key, color) in colors {
          hexColors[key] = color.resolvedColor(with: traitCollection).toHexString()
      }
      return hexColors
  }

  private func getFontWeightString(font: UIFont) -> String {
    guard let traits = font.fontDescriptor.object(forKey: .traits) as? [String: Any],
          let weight = traits[UIFontDescriptor.TraitKey.weight.rawValue] as? CGFloat else {
      return "regular"
    }

    if weight <= -0.8 { return "ultraLight" }
    if weight <= -0.6 { return "thin" }
    if weight <= -0.4 { return "light" }
    if weight <= 0.0 { return "regular" }
    if weight <= 0.23 { return "medium" }
    if weight <= 0.3 { return "semibold" }
    if weight <= 0.4 { return "bold" }
    if weight <= 0.56 { return "heavy" }
    return "black"
  }
}

extension UIColor {
    func toHexString() -> String {
        var r: CGFloat = 0
        var g: CGFloat = 0
        var b: CGFloat = 0
        var a: CGFloat = 0
        self.getRed(&r, green: &g, blue: &b, alpha: &a)
        let rgb: Int = (Int)(r*255)<<16 | (Int)(g*255)<<8 | (Int)(b*255)<<0
        return String(format:"#%06x", rgb)
    }
}
