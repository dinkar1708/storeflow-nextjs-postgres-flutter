// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'storeflow_api.swagger.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ApiAdminProductsPost$RequestBody _$ApiAdminProductsPost$RequestBodyFromJson(
  Map<String, dynamic> json,
) => ApiAdminProductsPost$RequestBody(
  name: json['name'] as String,
  description: json['description'] as String?,
  price: (json['price'] as num).toDouble(),
  costPrice: (json['costPrice'] as num?)?.toDouble(),
  stock: (json['stock'] as num?)?.toInt(),
  categoryId: json['categoryId'] as String,
  sku: json['sku'] as String?,
);

Map<String, dynamic> _$ApiAdminProductsPost$RequestBodyToJson(
  ApiAdminProductsPost$RequestBody instance,
) => <String, dynamic>{
  'name': instance.name,
  'description': instance.description,
  'price': instance.price,
  'costPrice': instance.costPrice,
  'stock': instance.stock,
  'categoryId': instance.categoryId,
  'sku': instance.sku,
};

ApiAdminUsersIdPatch$RequestBody _$ApiAdminUsersIdPatch$RequestBodyFromJson(
  Map<String, dynamic> json,
) => ApiAdminUsersIdPatch$RequestBody(
  role: apiAdminUsersIdPatch$RequestBodyRoleNullableFromJson(json['role']),
  isActive: json['isActive'] as bool?,
);

Map<String, dynamic> _$ApiAdminUsersIdPatch$RequestBodyToJson(
  ApiAdminUsersIdPatch$RequestBody instance,
) => <String, dynamic>{
  'role': apiAdminUsersIdPatch$RequestBodyRoleNullableToJson(instance.role),
  'isActive': instance.isActive,
};

ApiAuthLoginPost$RequestBody _$ApiAuthLoginPost$RequestBodyFromJson(
  Map<String, dynamic> json,
) => ApiAuthLoginPost$RequestBody(
  email: json['email'] as String,
  password: json['password'] as String,
);

Map<String, dynamic> _$ApiAuthLoginPost$RequestBodyToJson(
  ApiAuthLoginPost$RequestBody instance,
) => <String, dynamic>{'email': instance.email, 'password': instance.password};

ApiAuthRegisterPost$RequestBody _$ApiAuthRegisterPost$RequestBodyFromJson(
  Map<String, dynamic> json,
) => ApiAuthRegisterPost$RequestBody(
  email: json['email'] as String,
  password: json['password'] as String,
  name: json['name'] as String,
);

Map<String, dynamic> _$ApiAuthRegisterPost$RequestBodyToJson(
  ApiAuthRegisterPost$RequestBody instance,
) => <String, dynamic>{
  'email': instance.email,
  'password': instance.password,
  'name': instance.name,
};

ApiOrdersIdPatch$RequestBody _$ApiOrdersIdPatch$RequestBodyFromJson(
  Map<String, dynamic> json,
) => ApiOrdersIdPatch$RequestBody(status: json['status'] as String);

Map<String, dynamic> _$ApiOrdersIdPatch$RequestBodyToJson(
  ApiOrdersIdPatch$RequestBody instance,
) => <String, dynamic>{'status': instance.status};

ApiOrdersPost$RequestBody _$ApiOrdersPost$RequestBodyFromJson(
  Map<String, dynamic> json,
) => ApiOrdersPost$RequestBody(
  items: (json['items'] as List<dynamic>)
      .map(
        (e) => ApiOrdersPost$RequestBody$Items$Item.fromJson(
          e as Map<String, dynamic>,
        ),
      )
      .toList(),
  total: (json['total'] as num).toDouble(),
);

Map<String, dynamic> _$ApiOrdersPost$RequestBodyToJson(
  ApiOrdersPost$RequestBody instance,
) => <String, dynamic>{
  'items': instance.items.map((e) => e.toJson()).toList(),
  'total': instance.total,
};

ApiAdminUsersGet$Response _$ApiAdminUsersGet$ResponseFromJson(
  Map<String, dynamic> json,
) => ApiAdminUsersGet$Response(
  users: (json['users'] as List<dynamic>?)
      ?.map(
        (e) => ApiAdminUsersGet$Response$Users$Item.fromJson(
          e as Map<String, dynamic>,
        ),
      )
      .toList(),
);

Map<String, dynamic> _$ApiAdminUsersGet$ResponseToJson(
  ApiAdminUsersGet$Response instance,
) => <String, dynamic>{
  'users': instance.users?.map((e) => e.toJson()).toList(),
};

ApiAuthLoginPost$Response _$ApiAuthLoginPost$ResponseFromJson(
  Map<String, dynamic> json,
) => ApiAuthLoginPost$Response(
  token: json['token'] as String?,
  user: json['user'] == null
      ? null
      : ApiAuthLoginPost$Response$User.fromJson(
          json['user'] as Map<String, dynamic>,
        ),
);

Map<String, dynamic> _$ApiAuthLoginPost$ResponseToJson(
  ApiAuthLoginPost$Response instance,
) => <String, dynamic>{
  'token': instance.token,
  'user': instance.user?.toJson(),
};

ApiAuthRegisterPost$Response _$ApiAuthRegisterPost$ResponseFromJson(
  Map<String, dynamic> json,
) => ApiAuthRegisterPost$Response(
  message: json['message'] as String?,
  user: json['user'] == null
      ? null
      : ApiAuthRegisterPost$Response$User.fromJson(
          json['user'] as Map<String, dynamic>,
        ),
);

Map<String, dynamic> _$ApiAuthRegisterPost$ResponseToJson(
  ApiAuthRegisterPost$Response instance,
) => <String, dynamic>{
  'message': instance.message,
  'user': instance.user?.toJson(),
};

ApiProductsIdGet$Response _$ApiProductsIdGet$ResponseFromJson(
  Map<String, dynamic> json,
) => ApiProductsIdGet$Response(
  product: json['product'] == null
      ? null
      : ApiProductsIdGet$Response$Product.fromJson(
          json['product'] as Map<String, dynamic>,
        ),
);

Map<String, dynamic> _$ApiProductsIdGet$ResponseToJson(
  ApiProductsIdGet$Response instance,
) => <String, dynamic>{'product': instance.product?.toJson()};

ApiProductsGet$Response _$ApiProductsGet$ResponseFromJson(
  Map<String, dynamic> json,
) => ApiProductsGet$Response(
  products: (json['products'] as List<dynamic>?)
      ?.map(
        (e) => ApiProductsGet$Response$Products$Item.fromJson(
          e as Map<String, dynamic>,
        ),
      )
      .toList(),
);

Map<String, dynamic> _$ApiProductsGet$ResponseToJson(
  ApiProductsGet$Response instance,
) => <String, dynamic>{
  'products': instance.products?.map((e) => e.toJson()).toList(),
};

ApiOrdersPost$RequestBody$Items$Item
_$ApiOrdersPost$RequestBody$Items$ItemFromJson(Map<String, dynamic> json) =>
    ApiOrdersPost$RequestBody$Items$Item(
      productId: json['productId'] as String?,
      quantity: (json['quantity'] as num?)?.toInt(),
      price: (json['price'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$ApiOrdersPost$RequestBody$Items$ItemToJson(
  ApiOrdersPost$RequestBody$Items$Item instance,
) => <String, dynamic>{
  'productId': instance.productId,
  'quantity': instance.quantity,
  'price': instance.price,
};

ApiAdminUsersGet$Response$Users$Item
_$ApiAdminUsersGet$Response$Users$ItemFromJson(Map<String, dynamic> json) =>
    ApiAdminUsersGet$Response$Users$Item(
      id: json['id'] as String?,
      email: json['email'] as String?,
      name: json['name'] as String?,
      role: json['role'] as String?,
      isActive: json['isActive'] as bool?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$ApiAdminUsersGet$Response$Users$ItemToJson(
  ApiAdminUsersGet$Response$Users$Item instance,
) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'name': instance.name,
  'role': instance.role,
  'isActive': instance.isActive,
  'createdAt': instance.createdAt?.toIso8601String(),
  'updatedAt': instance.updatedAt?.toIso8601String(),
};

ApiAuthLoginPost$Response$User _$ApiAuthLoginPost$Response$UserFromJson(
  Map<String, dynamic> json,
) => ApiAuthLoginPost$Response$User(
  id: json['id'] as String?,
  email: json['email'] as String?,
  name: json['name'] as String?,
  role: json['role'] as String?,
);

Map<String, dynamic> _$ApiAuthLoginPost$Response$UserToJson(
  ApiAuthLoginPost$Response$User instance,
) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'name': instance.name,
  'role': instance.role,
};

ApiAuthRegisterPost$Response$User _$ApiAuthRegisterPost$Response$UserFromJson(
  Map<String, dynamic> json,
) => ApiAuthRegisterPost$Response$User(
  id: json['id'] as String?,
  email: json['email'] as String?,
  name: json['name'] as String?,
  role: json['role'] as String?,
);

Map<String, dynamic> _$ApiAuthRegisterPost$Response$UserToJson(
  ApiAuthRegisterPost$Response$User instance,
) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'name': instance.name,
  'role': instance.role,
};

ApiProductsIdGet$Response$Product _$ApiProductsIdGet$Response$ProductFromJson(
  Map<String, dynamic> json,
) => ApiProductsIdGet$Response$Product(
  id: json['id'] as String?,
  name: json['name'] as String?,
  description: json['description'] as String?,
  price: (json['price'] as num?)?.toDouble(),
  stockQuantity: (json['stockQuantity'] as num?)?.toInt(),
  isActive: json['isActive'] as bool?,
  images:
      (json['images'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      [],
  category: json['category'] == null
      ? null
      : ApiProductsIdGet$Response$Product$Category.fromJson(
          json['category'] as Map<String, dynamic>,
        ),
);

Map<String, dynamic> _$ApiProductsIdGet$Response$ProductToJson(
  ApiProductsIdGet$Response$Product instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'description': instance.description,
  'price': instance.price,
  'stockQuantity': instance.stockQuantity,
  'isActive': instance.isActive,
  'images': instance.images,
  'category': instance.category?.toJson(),
};

ApiProductsGet$Response$Products$Item
_$ApiProductsGet$Response$Products$ItemFromJson(Map<String, dynamic> json) =>
    ApiProductsGet$Response$Products$Item(
      id: json['id'] as String?,
      name: json['name'] as String?,
      description: json['description'] as String?,
      price: (json['price'] as num?)?.toDouble(),
      stockQuantity: (json['stockQuantity'] as num?)?.toInt(),
      isActive: json['isActive'] as bool?,
      images:
          (json['images'] as List<dynamic>?)
              ?.map((e) => e as Object)
              .toList() ??
          [],
      category: json['category'] == null
          ? null
          : ApiProductsGet$Response$Products$Item$Category.fromJson(
              json['category'] as Map<String, dynamic>,
            ),
    );

Map<String, dynamic> _$ApiProductsGet$Response$Products$ItemToJson(
  ApiProductsGet$Response$Products$Item instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'description': instance.description,
  'price': instance.price,
  'stockQuantity': instance.stockQuantity,
  'isActive': instance.isActive,
  'images': instance.images,
  'category': instance.category?.toJson(),
};

ApiProductsIdGet$Response$Product$Category
_$ApiProductsIdGet$Response$Product$CategoryFromJson(
  Map<String, dynamic> json,
) => ApiProductsIdGet$Response$Product$Category(
  id: json['id'] as String?,
  name: json['name'] as String?,
);

Map<String, dynamic> _$ApiProductsIdGet$Response$Product$CategoryToJson(
  ApiProductsIdGet$Response$Product$Category instance,
) => <String, dynamic>{'id': instance.id, 'name': instance.name};

ApiProductsGet$Response$Products$Item$Category
_$ApiProductsGet$Response$Products$Item$CategoryFromJson(
  Map<String, dynamic> json,
) => ApiProductsGet$Response$Products$Item$Category(
  id: json['id'] as String?,
  name: json['name'] as String?,
);

Map<String, dynamic> _$ApiProductsGet$Response$Products$Item$CategoryToJson(
  ApiProductsGet$Response$Products$Item$Category instance,
) => <String, dynamic>{'id': instance.id, 'name': instance.name};
