Кейсы выбора templateId в options для правил:

1. В правиле component выбирает в options компонент из repeater. Где rule.options.component будет как templateId. Обрабатываем как массив.

2. В правиле компонента в repeater (tempalte component) выбираем в options компонент вне repeater. Должны получить в каждом сгенерированном компоненте из template component правило с rule.options.component как compontnId.

3. В правиле компонента в repeater (tempalte component) выбираем в options компонент из repeater (другой tempalte component). Должны получить в каждом сгенерированном компоненте из template component правило с rule.options.component как templateId, обрабатываем как массив.



Другое:
- При выборе templateId в condition это будет обрабатываться как массив, т.е. итерация по всем компонентам


