import 'package:flutter_test/flutter_test.dart';
import 'package:storeflow/main.dart';

void main() {
  testWidgets('StoreFlow smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const StoreFlowApp());
    expect(find.text('Welcome to StoreFlow'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
  });
}
