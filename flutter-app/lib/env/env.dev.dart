import 'package:envied/envied.dart';

part 'env.dev.g.dart';

@Envied(path: '.env.dev')
abstract class EnvDev {
  @EnviedField(varName: 'API_BASE_URL', obfuscate: true)
  static final String apiBaseUrl = _EnvDev.apiBaseUrl;
}
