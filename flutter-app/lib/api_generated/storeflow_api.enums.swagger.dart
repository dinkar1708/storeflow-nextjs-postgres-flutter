// coverage:ignore-file
// ignore_for_file: type=lint

import 'package:json_annotation/json_annotation.dart';
import 'package:collection/collection.dart';

enum ApiAdminUsersIdPatch$RequestBodyRole {
  @JsonValue(null)
  swaggerGeneratedUnknown(null),

  @JsonValue('ADMIN')
  admin('ADMIN'),
  @JsonValue('STAFF')
  staff('STAFF'),
  @JsonValue('CUSTOMER')
  customer('CUSTOMER');

  final String? value;

  const ApiAdminUsersIdPatch$RequestBodyRole(this.value);
}
