package com.vinay.intelliview.interview.entity;

import com.vinay.intelliview.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(
        name = "interview_answers",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_interview_answer_question",
                columnNames = "question_id"
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewAnswer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private InterviewQuestion question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answerText;

    @Column
    private Integer technicalScore;

    @Column
    private Integer communicationScore;

    @Column
    private Integer confidenceScore;

    @Column
    private Integer overallScore;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;
}
