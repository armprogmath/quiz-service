export enum ExchangeType {
    Topic = "topic",
     Fanout = "fanout",
     Direct = "direct"
}

export enum Topics {
    EventQuizCalcTopic = "event.quiz.calc.topic",
    CommandQuizCalcTopic = "command.quiz.calc.topic",
}

export enum SendQuizCalculationRoutingKey {
    QuizCalculationSentRK = 'event.quiz.calculation.sent',

}

export enum EventNames {
    //EventCalculateResultSentRK= "event.calculation.result.sent",
}

export enum Consumers {
    //CommandCalculationConsumer = "command.calculation.consumer",
}
