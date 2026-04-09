import 'package:envied/envied.dart';

part 'env.prod.g.dart';

@Envied(path: '.env.prod')
abstract class EnvProd {
  @EnviedField(varName: 'API_BASE_URL', obfuscate: true)
  static final String apiBaseUrl = _EnvProd.apiBaseUrl;
}
