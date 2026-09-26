package com.vinay.intelliview.interview.entity;

import com.vinay.intelliview.common.BaseEntity;
import com.vinay.intelliview.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Interview extends BaseEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String targetRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private InterviewStatus status;

    @Column(nullable = false)
    private Integer totalQuestion;

    @Column(nullable = false)
    private Integer answeredQuestions;

    @Column
    private Integer overallScore;

    @Column
    private LocalDateTime startedAt;

    @Column
    private LocalDateTime completedAt;

}
