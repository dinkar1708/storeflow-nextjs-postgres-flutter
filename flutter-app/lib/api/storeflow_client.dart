import 'package:chopper/chopper.dart';
import 'package:flutter/foundation.dart';
import 'package:storeflow/api_generated/storeflow_api.swagger.dart';

/// Creates [StoreflowApi] without editing generated `lib/api_generated/*`.
///
/// In **debug** builds only, attaches Chopper’s built-in interceptors:
/// - [HttpLoggingInterceptor] — request/response lines, headers, bodies
/// - [CurlInterceptor] — equivalent `curl` command for terminal copy-paste
///
/// Enable log output by configuring [Logger.root] in `main.dart` (see there).
StoreflowApi createStoreflowApi(Uri baseUrl) {
  final interceptors = <Interceptor>[];
  if (kDebugMode) {
    interceptors.addAll([
      HttpLoggingInterceptor(level: Level.body),
      CurlInterceptor(),
    ]);
  }
  return StoreflowApi.create(
    baseUrl: baseUrl,
    interceptors: interceptors,
  );
}
