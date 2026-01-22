import ExpoModulesCore
import UIKit

public class ExpoSystemFontsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSystemFonts")

    Events("onDynamicTypeChange")

    Function("getFontMetrics") { () -> [String: Any] in
      return self.getAllFontMetrics()
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
    sendEvent("onDynamicTypeChange", getAllFontMetrics())
  }

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
        "textStyle": key
      ]
    }
    return metrics
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
