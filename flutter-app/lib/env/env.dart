import 'package:flutter/foundation.dart';
import 'package:storeflow/env/env.dev.dart';
import 'package:storeflow/env/env.prod.dart';

class Env {
  static String get apiBaseUrl => kReleaseMode ? EnvProd.apiBaseUrl : EnvDev.apiBaseUrl;
}
