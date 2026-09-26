package com.vinay.intelliview.interview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "interview_questions",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_interview_question_order",
                columnNames = {"interview_id", "question_order"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Column(nullable = false)
    private Integer questionOrder;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false, length = 50)
    private String questionType;

}
